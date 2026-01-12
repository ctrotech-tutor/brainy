// app/(platform)/institutions/review/[id]/_components/details-card.tsx
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InstitutionReviewData } from "@/app/(platform)/_types";

interface DetailsCardProps {
  institution: InstitutionReviewData;
}

// A small helper component for displaying data fields cleanly
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => {
  if (value === null || value === undefined) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-sm font-medium text-muted-foreground">
        {label}
      </dt>
      <dd className="col-span-2 text-sm">
        {value}
      </dd>
    </div>
  );
};


export function InstitutionDetailsCard({ institution }: DetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Institution Information</CardTitle>
        <CardDescription>
          Core details submitted by the applicant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <DetailItem label="Institution Name" value={institution.name} />
          <DetailItem label="Status" value={<Badge variant="secondary">{institution.status.replace(/_/g, ' ')}</Badge>} />
          <DetailItem label="Country" value={institution.country} />
          <DetailItem label="State/Province" value={institution.state} />
          <DetailItem label="Institution Type" value={institution.type?.replace(/_/g, ' ')} />
          <DetailItem label="Ownership" value={institution.ownership} />
          <DetailItem label="Year Established" value={institution.yearEstablished} />
          
          <div className="border-t my-2" />

          <DetailItem label="Website" value={<a href={institution.website || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{institution.website}</a>} />
          <DetailItem label="Domain" value={institution.domain} />
          <DetailItem label="Contact Email" value={institution.contactEmail} />
        </dl>
      </CardContent>
    </Card>
  );
}
