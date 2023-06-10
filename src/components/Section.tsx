import { api } from "~/utils/api";
import React from "react";
import { Card } from "./Card";

interface ISectionProps {
  sectionName: string;
}

export const Section: React.FC<ISectionProps> = ({ sectionName }) => {
  const { data: sectionData } = api.section.getSection.useQuery({
    id: sectionName.toLowerCase(),
  });

  const cardsList = React.useMemo(() => {
    if (sectionData == null || sectionData.section == null) {
      return;
    }

    const { cards } = sectionData.section;

    return cards.map((c) => <Card key={c.id} id={c.id} />);
  }, [sectionData]);

  return (
    <div className="flex flex-[2] flex-col">
      <div className="pb-4 font-bold">{sectionName}</div>
      <div className="flex flex-col flex-wrap gap-4 lg:flex-row">
        {cardsList}
      </div>
    </div>
  );
};
