import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Globe, Network } from 'lucide-react';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Stack,
} from '@nasnet/ui';

interface StubProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}

const StubShell: React.FC<StubProps> = ({ title, description, icon, ctaLabel, ctaHref }) => {
  const navigate = useNavigate();
  return (
    <Stack>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <EmptyState
          title={`${title} coming soon`}
          description="This section is stubbed. Backend wiring lands in a follow-up pass."
          icon={icon}
          actions={
            ctaHref ? (
              <Button onClick={() => navigate(ctaHref)}>{ctaLabel ?? 'Continue'}</Button>
            ) : undefined
          }
        />
      </Card>
    </Stack>
  );
};

export function DHCPPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <StubShell
      title="DHCP"
      description="Leases, pools, and DHCP server / client configuration."
      icon={<Network size={22} />}
      ctaHref={`/router/${id}`}
      ctaLabel="Back to overview"
    />
  );
}

export function DNSPage() {
  return (
    <StubShell
      title="DNS"
      description="Local DNS cache, static entries, and forwarders."
      icon={<Globe size={22} />}
    />
  );
}
