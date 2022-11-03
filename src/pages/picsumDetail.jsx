import React from "react";
import Header from "../components/header";
import styled from "styled-components";

const MsgDiv = styled.div`
  margin-top: 80px;
  font-size: 60px;
`;

const Body = styled.div`
  margin-top: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const H1 = styled.h1`
  border: 2px solid #2390DE;
  border-radius: 8px;
  color: white;
  background-color: #2390DE;
`;

const PicsumDetail = () => {
  const menuActive = 1;
  const [picsumDetailList, setPicsumDetailList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [currentPicsum, setCurrentPicsum] = React.useState(0);
  const [detailData, setDetailData] = React.useState(null);
  
  const getPicsumDetailList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://picsum.photos/v2/list`);

      if(response.status === 200) {
        const data = await response.json();
        setPicsumDetailList(data);
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
    if(picsumDetailList.length !== 0) {
      setDetailData(picsumDetailList[currentPicsum]);
    }
  }, [currentPicsum, picsumDetailList]);

  React.useEffect(() => {
    getPicsumDetailList();
  }, []);

  const PicsumCanvas = (props) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
      if (!canvasRef || !props.canvasData) {
        return;
      }

      const canvas = canvasRef.current;
      const DATA_MAX = picsumDetailList.length;
      const DATA_MIN = 0;

      let drag = false;
      let scale = 1;
      let canvasX = 0;
      let canvasY = 0;
      let diffX = 0;
      let diffY = 0;
      let angle = 0;
      let x_midpoint = canvas.width / 2;
      let y_midpoint = canvas.height / 2;

      if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
    
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
  
        img.src = props.canvasData.download_url;
      
        canvas.addEventListener('wheel', (event) => {
          // Sign Check
          const sign = Math.sign(event.deltaY);

          if (sign > 0) {
            if (DATA_MAX > currentPicsum) {
              setCurrentPicsum(currentPicsum + 1);
            }
          } else {
            if (DATA_MIN < currentPicsum) {
              setCurrentPicsum(currentPicsum - 1);
            }
          }
        });

        canvas.addEventListener('mousedown', (event) => {
          drag = true;
        });

        canvas.addEventListener('mouseup', (event) => {
          event.preventDefault();

          drag = false;

          if(diffX !== 0 && diffY !== 0) {
            canvasX = event.clientX - canvas.offsetLeft;
            canvasY = event.clientY - canvas.offsetTop;

            diffX = canvasX - x_midpoint;
            diffY = canvasY - y_midpoint;
            angle = Math.atan2(diffY, diffX);

            // Quadrant Check
            if (-Math.PI/4 < angle && angle < Math.PI/4) {
              angle = 0;
            } else if (Math.PI/4 < angle && angle < 3*Math.PI/4) {
              angle = 90;
            } else if (-3*Math.PI/4 < angle && angle < -Math.PI/4) {
              angle = -90;
            } else {
              angle = 180;
            }

            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.rotate(angle * Math.PI / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            diffX = 0;
            diffY = 0;
          }
        });

        canvas.addEventListener('mousemove', (event) => {
          if (drag) {
            if (event.buttons === 1) {
              event.preventDefault();

              scale += event.movementY * -0.01;
              scale = Math.min(Math.max(.125, scale), 4);

              ctx.clearRect(0,0,canvas.width,canvas.height);
              ctx.save();

              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.scale(scale, scale);
              ctx.rotate(angle * Math.PI / 180);
              ctx.translate(-canvas.width / 2, -canvas.height / 2);

              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              ctx.restore();
            } else if (event.buttons === 2) {
              event.preventDefault();

              canvasX = event.clientX - canvas.offsetLeft;
              canvasY = event.clientY - canvas.offsetTop;

              diffX = canvasX - x_midpoint;
              diffY = canvasY - y_midpoint;

              ctx.clearRect(0,0,canvas.width,canvas.height);
              ctx.save();
              
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.scale(scale, scale);
              ctx.rotate(Math.atan2(diffY, diffX));
              ctx.translate(-canvas.width / 2, -canvas.height / 2);

              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              ctx.restore();
            }
          }
        });

        canvas.addEventListener('contextmenu', (event) => {
          event.preventDefault();
        });
      }
    }, [canvasRef, props.canvasData]);

    return <canvas width="1280px" height="720px" ref={canvasRef} ></canvas>
  };

  return(
    <>
      <Header 
        menuActive={menuActive}
      />
      <Body>
        {loading && <MsgDiv>Loading...</MsgDiv>}
        {error && <MsgDiv>Error: {error}</MsgDiv>}
        {!loading && !error && detailData !== null &&
          <div>
            <PicsumCanvas 
              canvasData = {detailData}
            />
            <H1>{detailData.author}</H1>
          </div>
        }
      </Body>
    </>
  );
};

export default PicsumDetail;