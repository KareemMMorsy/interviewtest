import { useQuery } from '@tanstack/react-query';
import { Space, Table, TableProps } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface UsersTableProps {
  searchQuery: string;
}
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}
const columns: TableProps<User>['columns'] = [
  {
    title: 'Avatar',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (text) => <img src={text} alt="Avatar" style={{ width: 50, height: 50 }} />,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/edit-user/${record.id}`}>Edit</Link>
      </Space>
    ),
  },
];

function UsersTable({ searchQuery }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const { data, error, isLoading } = useQuery({
    queryKey: ['Users', currentPage,searchQuery],
    queryFn: () =>
      fetch(`https://reqres.in/api/users?${searchQuery?`per_page=${totalItems}`:`page=${currentPage}`}`)
        .then((res) => res.json())
        .then((data) => {
          setTotalItems(data.total);
          return data;
        }),
  });

  if (error) return <div>There was an error</div>;
  if (isLoading) return <div>Loading...</div>;

  // Filter data based on the search query
  const filteredData = data.data.filter(
    (user: any) =>
      user.email.toLowerCase().includes(searchQuery) ||
      user.first_name.toLowerCase().includes(searchQuery) ||
      user.last_name.toLowerCase().includes(searchQuery)
  );

  return (
    <Table<User>
      columns={columns}
      dataSource={filteredData.map((user: any) => ({
        key: user.id,
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
      }))}
      pagination={{
        current: currentPage,
        pageSize: data.per_page,
        total: totalItems,
        onChange: (page) => {
          setCurrentPage(page);
        },
      }}
    />
  );
}

export default UsersTable;
