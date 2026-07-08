import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "@/components/EmptyState";
import { apiClient, TrackerEntry } from "@/lib/api";
import { TRACKER_STAGES, formatShortDate } from "@/lib/placemate";

function sortTrackerEntries(entries: TrackerEntry[]) {
  return [...entries].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || a.appliedDate).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || b.appliedDate).getTime();
    if (aTime !== bTime) {
      return bTime - aTime;
    }
    return b.id.localeCompare(a.id);
  });
}

export default function Tracker() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    companyName: "",
    role: "",
    appliedDate: "",
    nextAction: "",
    nextActionDate: "",
    notes: "",
  });

  const loadTracker = useCallback(
    async (cursor?: string | null) => {
      if (cursor) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await apiClient.getTracker({ limit: 20, cursor });
        setEntries((prev) => {
          if (!cursor) {
            return sortTrackerEntries(response.data);
          }
          const existingIds = new Set(prev.map((entry) => entry.id));
          return sortTrackerEntries([...prev, ...response.data.filter((entry) => !existingIds.has(entry.id))]);
        });
        setNextCursor(response.nextCursor);
        setHasMore(response.hasMore);
      } catch (error) {
        toast({
          title: "Could not load tracker",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    loadTracker(null);
  }, [loadTracker]);

  const columns = useMemo(
    () =>
      TRACKER_STAGES.map((stage) => ({
        stage,
        items: entries.filter((entry) => entry.currentStage === stage),
      })),
    [entries],
  );

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const stage = result.destination.droppableId;
    if (stage === result.source.droppableId) return;
    const item = entries.find((entry) => entry.id === result.draggableId);
    if (!item) return;

    setEntries((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, currentStage: stage } : entry)));
    try {
      const updated = await apiClient.updateTrackerEntry(item.id, { currentStage: stage });
      setEntries((prev) => sortTrackerEntries(prev.map((entry) => (entry.id === item.id ? updated : entry))));
    } catch (error) {
      toast({
        title: "Stage update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const createEntry = async () => {
    setIsSaving(true);
    try {
      const created = await apiClient.createTrackerEntry({
        ...draft,
        currentStage: "Applied",
      });
      setEntries((prev) => sortTrackerEntries([created, ...prev]));
      setDraft({
        companyName: "",
        role: "",
        appliedDate: "",
        nextAction: "",
        nextActionDate: "",
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Could not create tracker item",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeEntry = async (id: string) => {
    try {
      await apiClient.deleteTrackerEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="px-4 py-10">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="pill">Application pipeline</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Track every company from applied to outcome</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-400">
              Move applications across rounds, keep next actions visible, and avoid losing track during the busiest weeks.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-slate-950">
              <DialogHeader>
                <DialogTitle className="text-white">Add application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={draft.companyName} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Applied Date</Label>
                  <Input type="date" value={draft.appliedDate} onChange={(e) => setDraft({ ...draft, appliedDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Next Action</Label>
                  <Input value={draft.nextAction} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Next Action Date</Label>
                  <Input type="date" value={draft.nextActionDate} onChange={(e) => setDraft({ ...draft, nextActionDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
                </div>
                <Button className="w-full" onClick={createEntry} disabled={isSaving || !draft.companyName || !draft.role}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Create entry"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-300">Loading tracker...</div>
        ) : entries.length ? (
          <>
            <div className="overflow-x-auto pb-4">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex min-w-max gap-4">
                  {columns.map((column) => (
                    <Droppable droppableId={column.stage} key={column.stage}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="w-[290px] shrink-0 rounded-3xl border border-white/10 bg-slate-950/70 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{column.stage}</h2>
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">{column.items.length}</span>
                          </div>
                          <div className="space-y-3">
                            {column.items.map((item, index) => (
                              <Draggable draggableId={item.id} index={index} key={item.id}>
                                {(dragProvided) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <p className="font-semibold text-white">{item.companyName}</p>
                                        <p className="text-sm text-slate-400">{item.role}</p>
                                      </div>
                                      <button type="button" onClick={() => removeEntry(item.id)} className="text-slate-500 transition hover:text-rose-300">
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                                      <p>Applied: {formatShortDate(item.appliedDate)}</p>
                                      <p>Next: {item.nextAction || "No next action set"}</p>
                                      {item.nextActionDate ? <p>Date: {formatShortDate(item.nextActionDate)}</p> : null}
                                      {item.notes ? <p className="text-slate-400">{item.notes}</p> : null}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>
            </div>
            {hasMore ? (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={() => loadTracker(nextCursor)} disabled={isLoadingMore || !nextCursor}>
                  {isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Load more
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState
            icon={Plus}
            title="No applications in your tracker yet"
            description="Add your first company and start moving it across OA, technical rounds, HR, and final outcome."
          />
        )}
      </div>
    </div>
  );
}
