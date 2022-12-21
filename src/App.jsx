import { useState, useEffect, Fragment } from 'react'
import './App.css'
import Moveable from 'react-moveable'

function App() {

  const [data, setData] = useState(null)
  const [isDraggin, setIsDraggin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [itemResize, setItemResize] = useState({})
  const [deltaWidth, setDeltaWidth] = useState(0)
  const [deltaHeight, setDeltaHeight] = useState(0)

  useEffect(() => {
    setLoading(true)
    const consultarAPI = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/photos')
      const allData = await response.json()
      setData(allData.slice(0, 5))
      setLoading(false)
    }

    consultarAPI()
  }, [])

  const draggin = () => {
    setIsDraggin(true)
  }
  
  const droping = (target) => {
    setData(data.filter(item => item.title.slice(0,3) !== target.classList[0]))
    setIsDraggin(false)
  }

  const resize = (target, delta) => {
    // let item = {target}
    setItemResize(data.filter(item => item.title.slice(0,3) === target.classList[0]))
    setDeltaWidth(300 + (delta[0] * 1000 - 1000))
    setDeltaHeight(300 + (delta[1] * 1000 - 1000))
  }

  return (
    <div className="App">
      <h1>Challenge</h1>

      <h1>Resize, Drag and drop</h1>
      <div className="drags">
        <div>
          {data !== null && (
            <h1>{`${
              !loading && data !== null
                ? Object.entries(data).length !== 0
                  ? "Arrastra para eliminar"
                  : "Ya no hay elementos a eliminar"
                : null
            }`}</h1>
          )}
          {!loading &&
            data !== null &&
            data.map((d) => (
              <Fragment key={d.id}>
                <img
                  src={d.thumbnailUrl}
                  className={`${d.title.slice(0, 3)}`}
                  style={{
                    width:
                      deltaWidth === 0
                        ? 300
                        : d.title.slice(0, 3) == itemResize.title
                          ? deltaWidth
                          : deltaWidth,
                    height:
                      deltaHeight === 0
                        ? 300
                        : d.title.slice(0, 3) == itemResize.title
                          ? deltaHeight
                          : deltaHeight,
                  }}
                />
                {console.log(d.title.slice(0, 3) === itemResize.title)}
                <Moveable
                  target={document.querySelector(`.${d.title.slice(0, 3)}`)}
                  // origin={true}
                  // container={null}
                  draggable={true}
                  onDrag={({ target }) => {
                    draggin(target);
                  }}
                  onDragEnd={({ target }) => {
                    droping(target);
                  }}
                  scalable={true}
                  onScale={({
                    target,
                    scale,
                    dist,
                    delta,
                    transform,
                    clientX,
                    clientY,
                  }) => {
                    resize(target, delta);
                    // target!.style.transform = transform;
                  }}
                  onScaleEnd={({ target, isDrag, clientX, clientY }) => {
                    console.log("onScaleEnd", target, isDrag);
                  }}
                />
              </Fragment>
            ))}
        </div>
        <div className={`${isDraggin ? "drops" : ""} dropsZone`}>
          <h1>{`${isDraggin ? "Suelta aquí" : "Bote de basura"}`}</h1>
        </div>
      </div>
    </div>
  );
}

export default App
