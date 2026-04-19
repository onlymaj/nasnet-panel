import { Card, SectionGrid, Skeleton, Stack } from '@nasnet/ui';
import styles from '../WirelessPage.module.scss';

const statKeys = Array.from({ length: 4 }, (_, i) => `stat-${i}`);
const rowKeys = Array.from({ length: 3 }, (_, i) => `row-${i}`);
const ifaceKeys = Array.from({ length: 2 }, (_, i) => `iface-${i}`);

export function WirelessSkeleton() {
  return (
    <Stack>
      <SectionGrid>
        {statKeys.map((key) => (
          <Card key={key} className={styles.statCard}>
            <Skeleton width={90} height={12} />
            <Skeleton width={60} height={28} />
            <Skeleton width={110} height={10} />
          </Card>
        ))}
      </SectionGrid>

      <Card>
        <div className={styles.skeletonHeader}>
          <Stack $gap="8px">
            <Skeleton width={160} height={18} />
            <Skeleton width={240} height={12} />
          </Stack>
          <Skeleton width={96} height={32} radius={8} />
        </div>
        <Stack>
          {rowKeys.map((key) => (
            <Skeleton key={key} height={44} radius={8} />
          ))}
        </Stack>
      </Card>

      <Card>
        <div className={styles.skeletonHeader}>
          <Stack $gap="8px">
            <Skeleton width={180} height={18} />
            <Skeleton width={260} height={12} />
          </Stack>
          <Skeleton width={120} height={32} radius={8} />
        </div>
        <div className={styles.interfaceGrid}>
          {ifaceKeys.map((key) => (
            <Skeleton key={key} height={72} radius={8} />
          ))}
        </div>
      </Card>
    </Stack>
  );
}
