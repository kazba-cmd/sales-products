import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

//
import { REST_URL } from 'utils/constants';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

const MealMenuContext = createContext({});

function useMealMenuContext() {
  return useContext(MealMenuContext);
}

MealMenuContextProvider.propTypes = {
  children: PropTypes.node
};

const style = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  // right: '0',
  left: '40%',
  margin: 'auto'
};

function MealMenuContextProvider({ children }) {
  // usestate hooks
  const {
    currentUser: { userInfo }
  } = useSelector((state) => state.user);
  const sellingPointId = useSelector((state) => state.SP.currentTT.id);
  const [products, setProducts] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [hotDish, setHotDish] = useState([]);
  const [Souses, setSouses] = useState([]);
  const [Topings, setTopings] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [childMenu, setChildMenu] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  // api get prouducts
  const getProducts = async () => {
    await axios
      .get(`${REST_URL}/product/available?sellingPointId=${sellingPointId}&productTypeKey=PRODUCT`)
      .then((resp) => {
        setProducts(resp.data);
      });
    // const productsResponse = await getProducts();
    // const { data: productsList } = productsResponse.data;
    // setProducts(productsList.map(({ rows, ...rest }) => ({ ...rest, type: 'amazon' })));
    // return response;
  };
  // api get drinks
  const getDrinks = async () => {
    await axios
      .get(`${REST_URL}/product/available?sellingPointId=${sellingPointId}&productTypeKey=DRINK`)
      .then((resp) => {
        setDrinks(resp.data);
      });
  };
  const getHotDish = async () => {
    await axios
      .get(`${REST_URL}/product/available?sellingPointId=${sellingPointId}&productTypeKey=HOT_DISH`)
      .then((resp) => {
        setHotDish(resp.data);
      });
  };
  // api get sauces
  const getSauces = async () => {
    await axios
      .get(`${REST_URL}/product/available?sellingPointId=${sellingPointId}&productTypeKey=SAUCE`)
      .then((resp) => {
        setSouses(resp.data);
      });
  };
  // api get clothes
  const getClothes = async () => {
    await axios.get(`${REST_URL}/product?productTypeKey=CLOSES`).then((resp) => {
      setClothes(resp.data);
    });
  };
  const getToppings = async () => {
    await axios
      .get(`${REST_URL}/product/available?sellingPointId=${sellingPointId}&productTypeKey=TOPPING`)
      .then((resp) => {
        setTopings(resp.data);
      });
  };

  const getEvents = async () => {
    await axios.get(`${REST_URL}/combo`).then((resp) => {
      setEvents(resp.data);
    });
  };

  const getChildMenus = async () => {
    await axios
      .get(`${REST_URL}/product?productTypeKey=CHILDREN&sellingPointId=${sellingPointId}`)
      .then((resp) => {
        setChildMenu(resp.data);
      });
  };

  // entry function
  const init = async () => {
    setLoading(true);
    // продукты
    getProducts();
    // напитки
    getDrinks();
    // горячее
    getHotDish();
    // акция
    getEvents();
    // соусы
    getSauces();
    // топпинги
    getToppings();
    // одежда
    getClothes();
    // детское меню
    getChildMenus();
    // TODO убрать эту хуйню как добавят цену на соусы
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const value = {
    products,
    drinks,
    hotDish,
    Souses,
    Topings,
    events,
    clothes,
    childMenu
  };

  return (
    <>
      <MealMenuContext.Provider value={value}>{children}</MealMenuContext.Provider>
      {loading && <CircularProgress sx={style} />}
    </>
  );
}

export { useMealMenuContext, MealMenuContextProvider };
