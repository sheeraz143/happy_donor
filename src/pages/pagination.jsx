import { useEffect, useState } from "react";
import { Pagination, List, Spin } from "antd";
import axios from "axios";

const ITEMS_PER_PAGE = 10; // Number of items per page

const PaginatedList = () => {
  const [data, setData] = useState([]); // Store fetched data
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalItems, setTotalItems] = useState(0); // Total items state
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch data based on the current page
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${ITEMS_PER_PAGE}`
      );
      setData(response.data); // Set fetched data
      console.log('response.data: ', response.data);
      setTotalItems(100); // JSONPlaceholder has 100 items for /posts, adjust if using a different API
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or the page changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Paginated List</h2>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <List
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<strong>{item.title}</strong>}
                description={item.body}
              />
            </List.Item>
          )}
        />
      )}
      <Pagination
        style={{ textAlign: "center", marginTop: 16 }}
        current={currentPage}
        total={totalItems}
        pageSize={ITEMS_PER_PAGE}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
};

export default PaginatedList;
