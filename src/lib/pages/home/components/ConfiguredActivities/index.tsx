import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Empty, List, Typography } from 'antd';
import { useState } from 'react';
import { ACTIVITY_TEXT, GRID_CONFIG, MAX_ACTIVITIES } from './constants';
import { mockActivities } from './mocks';
import type { ActivityType } from './types';
import './styles.css';
import { TagSection } from '../TagSection';

const { Title } = Typography;

export const ConfiguredActivites = () => {
  const [activities, _] = useState<ActivityType[]>(mockActivities);

  const createEmptyActivity = (index: number) => ({
    id: `empty-${index}`,
    isEmpty: true,
  });

  const displayItems = Array.from(
    { length: MAX_ACTIVITIES },
    (_, index) => activities[index] || createEmptyActivity(index),
  );

  const handleDeleteActivity = (id: string) => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Delete activity with id: ${id}`);
  };

  return (
    <>
      <Title level={5} className="title-section">
        {ACTIVITY_TEXT.TITLE}
      </Title>
      <List
        itemLayout="vertical"
        dataSource={displayItems}
        grid={GRID_CONFIG}
        renderItem={(item) => (
          <List.Item>
            {item.isEmpty ? (
              <Empty
                className="empty-activity"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Typography.Text className="empty-description">
                    {ACTIVITY_TEXT.EMPTY_DESCRIPTION}
                  </Typography.Text>
                }
              />
            ) : (
              <Card
                title={item.activityName}
                size="small"
                extra={
                  <div>
                    <Button
                      icon={<EditOutlined />}
                      type="text"
                      className="edit-button"
                    />
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      onClick={() => handleDeleteActivity(item.id)}
                    />
                  </div>
                }
              >
                <p className="description">{item.description}</p>

                <TagSection
                  items={item.inputs}
                  label={ACTIVITY_TEXT.INPUTS_LABEL}
                  color="blue"
                  className="tag-section"
                />

                <TagSection
                  items={item.outputs}
                  label={ACTIVITY_TEXT.OUTPUTS_LABEL}
                  color="green"
                  className="tag-section"
                />

                <TagSection
                  items={item.assignedUsers}
                  label={ACTIVITY_TEXT.ASSIGNED_LABEL}
                  color="purple"
                />
              </Card>
            )}
          </List.Item>
        )}
      />
    </>
  );
};
