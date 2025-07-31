import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Building2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  logo: string;
  description: string;
  skills: string[];
  posted: string;
  featured?: boolean;
}

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "Application Submitted! 🎉",
      description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
    });
  };

  return (
    <div className={`glass-card p-6 hover-lift group relative ${
      job.featured ? 'ring-2 ring-primary/50' : ''
    }`}>
      {job.featured && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-gradient-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={job.logo}
            alt={`${job.company} logo`}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <Building2 className="w-4 h-4 mr-1" />
              {job.company}
            </div>
          </div>
        </div>
        <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
          {job.type}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          {job.salary}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.posted}
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills.map((skill) => (
          <Badge key={skill} variant="outline" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
        >
          View Details
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={handleApply}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobCard;