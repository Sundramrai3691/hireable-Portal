import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/data/faq.json";

const FAQ = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Placement FAQ
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Practical answers for the questions students actually ask during placement season.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id.toString()}
                className="card px-6"
              >
                <AccordionTrigger className="py-6 text-left text-lg font-semibold text-white transition-colors hover:text-blue-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-slate-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
