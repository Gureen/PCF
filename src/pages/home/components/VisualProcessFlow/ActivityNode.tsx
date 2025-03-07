import { Handle, type NodeProps, Position } from '@xyflow/react';
import { Tag } from 'antd';
import type { ActivityNodeData } from './types';

import './styles.css';

export function ActivityNode({ data, id }: NodeProps<ActivityNodeData>) {
  return (
    <div className="activity-node">
      <div className="activity-node-header">{data.label}</div>

      {data.description && (
        <div className="activity-node-description">{data.description}</div>
      )}

      {data.inputs && data.inputs.length > 0 && (
        <div className="activity-node-section">
          <div className="activity-node-section-title">Inputs:</div>
          <div className="activity-node-tags">
            {data.inputs.map((input, _) => (
              <Tag key={`${id}-input-${input}`} color="blue">
                {input}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {data.outputs && data.outputs.length > 0 && (
        <div className="activity-node-section">
          <div className="activity-node-section-title">Outputs:</div>
          <div className="activity-node-tags">
            {data.outputs.map((output, _) => (
              <Tag key={`${id}-output-${output}`} color="green">
                {output}
              </Tag>
            ))}
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
