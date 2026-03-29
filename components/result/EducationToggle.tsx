"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type EducationToggleProps = {
  content: string;
};

export default function EducationToggle({ content }: EducationToggleProps) {
  return (
    <Accordion multiple={false}>
      <AccordionItem value="why">
        <AccordionTrigger className="text-brand-slate font-medium">
          Why does this happen?
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-brand-mid leading-relaxed">{content}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
