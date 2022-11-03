import React from "react";
import Header from "../components/header";
import styled from "styled-components";

const MsgDiv = styled.div`
  margin-top: 80px;
  font-size: 60px;
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Table = styled.table`
  margin-top: 36px;
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;

  thead {
    background-color: #2390DE;
    height: 36px;
    color: #ffffff;
  }

  th, td {
    padding: 8px 12px;
    text-align: left;
  }
`;

const Button = styled.button`
  background-color: #2390DE;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin: 20px 6px;

  &.active {
    color: #000000;
  }
`;

const PicsumList = () => {
  const menuActive = 0;
  const [picsumList, setPicsumList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [thList, setThList] = React.useState([]);
  const [totalPage, setTotalPage] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);

  const getPicsumList = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://picsum.photos/v2/list");

      if (response.status === 200) { 
        const data = await response.json();
        setPicsumList(data);
      } else {
        setError(`Response status: ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getPicsumList();
  }, []);

  React.useEffect(() => {
    if(picsumList.length !== 0) {
      setThList(Object.keys(picsumList[0]));
      setTotalPage(Math.ceil(picsumList.length / 4));
    }
  }, [picsumList]);

  React.useEffect(() => {
    if(picsumList.length !== 0){
      let thListLength = thList.length;
      let itemListLength = Object.keys(picsumList[0]).length;

      if(itemListLength === thListLength) {
        setThList([...thList, "Thumbnail"]);
      }
    }
  // eslint-disable-next-line
  }, [thList]);

  return(
    <>
      <Header 
        menuActive={menuActive}
      />
      <Body>
          {loading && <MsgDiv>Loading...</MsgDiv>}
          {error && <MsgDiv>Error: {error}</MsgDiv>}
          {picsumList.length === 0 && !loading && !error && <MsgDiv>No data</MsgDiv>}
          {!loading && !error && picsumList.length !== 0 &&
            <Table>
              <thead>
                <tr>
                  {thList.map((item, index) => (
                    <th key={index}>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {picsumList.map((item, index) => {
                  if(index >= (currentPage - 1) * 4 && index < currentPage * 4) {
                    return(
                      <tr key={index}>
                        {thList.map((thItem, thIndex) => {
                          if(thItem === "Thumbnail") {
                            return (
                              <td key={thIndex}>
                                <img src={item.download_url} alt={item.author} width={150} height={150}/>
                              </td>
                            );
                          } else {
                            return (
                              <td key={thIndex}>{item[thItem]}</td>
                            );
                          }
                        })}
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
              </tbody>
            </Table>
          }
      </Body>
      <Body>
        {new Array(totalPage).fill(0).map((item, index) => (
          <Button 
            className={currentPage === index + 1 ? "active" : ""}
            key={index}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index+1}
          </Button>
        ))}
      </Body>
    </>
  );
};

export default PicsumList;