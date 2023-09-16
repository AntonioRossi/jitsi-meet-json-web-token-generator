// @/pages/index.tsx

import React from 'react';
import Plan from '../components/Plan';
import Secrets from '../components/Secrets';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const IndexPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Plan" key="1">
          <Plan />
        </TabPane>
        <TabPane tab="Secrets" key="2">
          <Secrets />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default IndexPage;
