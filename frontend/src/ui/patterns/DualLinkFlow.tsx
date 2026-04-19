import React from 'react';
import { Globe, Laptop, SatelliteDish, Server, Wifi } from 'lucide-react';
import styles from './DualLinkFlow.module.scss';

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ');

interface NodeProps {
  left: string;
  top: string;
  icon: React.ReactNode;
  label: string;
  labelAbove?: boolean;
}

const Node: React.FC<NodeProps> = ({ left, top, icon, label, labelAbove }) => (
  <div className={cx(styles.node, labelAbove && styles.nodeAbove)} style={{ left, top }}>
    <div className={styles.nodeIcon}>{icon}</div>
    <div className={styles.nodeLabel}>{label}</div>
  </div>
);

const dotDelays = [0, 0.9, 1.8];
const DOT_DUR = 2.8;

const Dots: React.FC<{ pathId: string; prefix: string }> = ({ pathId, prefix }) => (
  <>
    {dotDelays.map((d) => (
      <circle key={`${prefix}-${d}`} r="3" opacity="0" className={styles.dotGreen}>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.1;0.9;1"
          dur={`${DOT_DUR}s`}
          begin={`${d}s`}
          repeatCount="indefinite"
        />
        <animateMotion dur={`${DOT_DUR}s`} repeatCount="indefinite" begin={`${d}s`}>
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    ))}
  </>
);

export interface DualLinkFlowProps {
  ariaLabel?: string;
}

export const DualLinkFlow: React.FC<DualLinkFlowProps> = ({
  ariaLabel = 'Dual-link traffic flow',
}) => (
  <div className={styles.wrap} role="img" aria-label={ariaLabel}>
    <svg className={styles.svg} viewBox="0 0 500 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <marker
          id="dual-arrow"
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" className={styles.arrow} />
        </marker>
      </defs>

      <path
        id="dl-stem"
        d="M 78 100 L 128 100"
        className={styles.track}
        markerEnd="url(#dual-arrow)"
      />
      <path
        id="dl-top-arm"
        d="M 178 92 L 280 52"
        className={styles.track}
        markerEnd="url(#dual-arrow)"
      />
      <path
        id="dl-bottom-arm"
        d="M 178 108 L 280 148"
        className={styles.track}
        markerEnd="url(#dual-arrow)"
      />
      <path
        id="dl-top-row"
        d="M 330 48 L 412 48"
        className={styles.track}
        markerEnd="url(#dual-arrow)"
      />
      <path
        id="dl-bottom-row"
        d="M 330 152 L 412 152"
        className={styles.track}
        markerEnd="url(#dual-arrow)"
      />

      <Dots pathId="dl-stem" prefix="stem" />
      <Dots pathId="dl-top-arm" prefix="topArm" />
      <Dots pathId="dl-top-row" prefix="topRow" />
      <Dots pathId="dl-bottom-arm" prefix="bottomArm" />
      <Dots pathId="dl-bottom-row" prefix="bottomRow" />
    </svg>

    <Node left="10%" top="50%" icon={<Laptop size={32} strokeWidth={1.75} />} label="USER" />
    <Node left="30%" top="50%" icon={<Wifi size={32} strokeWidth={1.75} />} label="Router" />
    <Node
      left="61%"
      top="24%"
      icon={<Globe size={32} strokeWidth={1.75} />}
      label="Domestic WAN"
      labelAbove
    />
    <Node
      left="88%"
      top="24%"
      icon={<Server size={32} strokeWidth={1.75} />}
      label="Domestic Site"
      labelAbove
    />
    <Node
      left="61%"
      top="76%"
      icon={<SatelliteDish size={32} strokeWidth={1.75} />}
      label="Starlink"
    />
    <Node
      left="88%"
      top="76%"
      icon={<Server size={32} strokeWidth={1.75} />}
      label="Foreign Site"
    />
  </div>
);
