import { Input, Space } from 'antd';
import { useState } from 'react';
import UsersTable from '../components/UsersTable';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Search users by email or name"
          onChange={handleSearch}
          allowClear
          style={{ marginBottom: '20px' }}
        />
        <UsersTable searchQuery={searchQuery} />
      </Space>
    </div>
  );
}

export default Home;
