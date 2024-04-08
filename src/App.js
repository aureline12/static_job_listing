/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import { data } from "./data";

function App() {
  const [newData, setData] = useState(data);

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);
    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    data.map((val) => {
      if (!options.includes(val.role)) {
        setOptions([...options, val.role]);
      }
      if (!options.includes(val.level)) {
        setOptions([...options, val.level]);
      }
      val.languages.forEach((val, i) => {
        if (!options.includes(val)) {
          setOptions([...options, val]);
        }
      });
      val.tools.forEach((val, i) => {
        if (!options.includes(val)) {
          setOptions([...options, val]);
        }
      });
      val["others"] = [val.role, val.level, ...val.languages, ...val.tools];
    });
  }, [options]);

  console.log("newData", newData);
  const [focus, setFocus] = useState(false);
  const handleFocus = (event) => {
    event.stopPropagation(); // Empêche la propagation de l'événement de clic
    if (focus) {
      setFocus(false);
    } else {
      setFocus(true);
    }
  };
  const [selectOptions, setSelectOptions] = useState([]);
  const handleSelect = (value) => {
    const newOptions = [...selectOptions, value];
    setSelectOptions(newOptions);
    const result = [];
    data.filter((data) => {
      for (const val of data.others) {
        if (newOptions.includes(val)) {
          if (!result.includes(data)) {
            result.push(data);
          }
        }
      }
    });

    setData(result);
  };
  const handleClose = (value) => {
    setFocus(false);
    const resultData = selectOptions.filter((val) => val !== value);
    setSelectOptions(resultData);
    const result = [];
    data.filter((data) => {
      for (const val of data.others) {
        if (resultData.includes(val)) {
          if (!result.includes(data)) {
            result.push(data);
          }
        }
      }
    });
    if (resultData.length === 0) {
      setData(data);
    } else {
      setData(result);
    }
  };

  const handleDeleteAll = () => {
    setSelectOptions([]);
    setData(data);
    setFocus(false);
  }; // delete all select options
  
  const listOptionsRef = useRef(null);
  // Gérer la fermeture de la liste lorsque l'utilisateur clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        listOptionsRef.current &&
        !listOptionsRef.current.contains(event.target)
      ) {
        setFocus(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [focus]);

  return (
    <div className="App pb-2">
      <header className="header">
        <img
          src="/images/bg-header-desktop.svg"
          className="img-fluid"
          alt="logo"
          style={{ height: "18vh", width: "100%" }}
        />
      </header>
      <main className="listContain">
        {focus && (
          <div className={`p-3 listOptions`} ref={listOptionsRef}>
            <ul className="list-unstyled">
              {options
                .filter((val) => !selectOptions.includes(val))
                .map((val, i) => (
                  <li
                    key={val}
                    className="px-3 py-2 li"
                    onClick={() => handleSelect(val)}
                  >
                    {val}
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className="">
          <div
            className="border-0 input px-2 pt-1"
            onClick={handleFocus}
            // contentEditable={true}
            tabIndex={0}
          >
            {selectOptions.map((val) => (
              <span key={val} className=" pb-5 me-2">
                <span className="badge selectOptions">{val}</span>
                <span
                  className="badge optionClose"
                  onClick={() => handleClose(val)}
                >
                  x
                </span>
              </span>
            ))}
          </div>
          {selectOptions.length > 0 && (
            <a className="link" href="#" onClick={handleDeleteAll}>
              Clear
            </a>
          )}
        </div>

        <div className="cardList pe-lg-5">
          {screenSize.width > 500 &&
            newData.map((data) => (
              <Card
                key={data.id}
                Style={
                  data.new && data.featured ? `cardBorder` : `cardNoBorder`
                }
                img={data.logo}
                content={
                  <div className="">
                    <h6 className="company d-flex">
                      <span className="mt-1">{data.company}</span>
                      {data.new && (
                        <span
                          className={`ms-1 badge rounded-pill badgeNew pt-2`}
                        >
                          New!
                        </span>
                      )}
                      {data.featured && (
                        <span className="ms-1 badge rounded-pill badgeFeatured pt-2">
                          Featured
                        </span>
                      )}
                    </h6>
                    <span className="fw-bold position">{data.position}</span>
                    <p className="mt-1 time">
                      <span>{data.postedAt} - </span>
                      <span>{data.contract} - </span>
                      <span>{data.location} </span>
                    </p>
                  </div>
                }
                languages={
                  <div className="d-flex justify-content-center align-items-center flex-wrap mt-4">
                    {[
                      ...data.languages,
                      ...data.tools,
                      data.role,
                      data.level
                    ].map((val) => (
                      <span className="badge language pt-2 ms-2 mb-2">
                        {val}
                      </span>
                    ))}
                  </div>
                }
              />
            ))}

          {screenSize.width <= 500 &&
            newData.map((data) => (
              <div
                key={data.id}
                className={`card cardMobile px-3 py-4 mt-5 ${
                  data.new && data.featured ? `cardBorder` : `cardNoBorder`
                }`}
              >
                <div className="img">
                  <img
                    src={data.logo}
                    className="img-fluid"
                    alt="logo"
                    width={35}
                    height={35}
                  />
                </div>
                <h6 className="company">
                  {data.company}
                  {data.new && (
                    <span className={`ms-2 badge rounded-pill badgeNew pt-2`}>
                      New!
                    </span>
                  )}
                  {data.featured && (
                    <span className="ms-1 badge rounded-pill badgeFeatured pt-2">
                      Featured
                    </span>
                  )}
                </h6>
                <span className="fw-bold position">{data.position}</span>
                <p className="mt-1 time">
                  <span>{data.postedAt} - </span>
                  <span>{data.contract} - </span>
                  <span>{data.location} </span>
                </p>
                <hr />
                <div className="d-flex align-items-center h-100 flex-wrap">
                  {[
                    ...data.languages,
                    ...data.tools,
                    data.role,
                    data.level
                  ].map((val) => (
                    <span className="badge language pt-2 ms-2 mb-2">{val}</span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

export default App;
