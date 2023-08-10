import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Store } from "../../Store";
import { getError } from "../utils";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const reducer = (state, action) => {
  debugger;
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function AccountDetailScreen() {
  debugger;
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [idCustomer, setIdCustomer] = useState("");
  const [nameCustomer, setNameCustomer] = useState("");
  const [num, setNum] = useState("");
  const [ammount, setAmount] = useState("");
  const [limit, setLimit] = useState(false);
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  useEffect(() => {
    debugger;
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/accounts`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/customers/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Creditos</title>
      </Helmet>
      <h1>Informacion del Credito</h1>

      <Form>
        <div class="row">
          <div class="col">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Numero del prestamo</Form.Label>
              <Form.Control value={nameCustomer} readOnly />
            </Form.Group>
          </div>
          <div class="col">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Cliente</Form.Label>

              <Form.Control type="Ammount" value={ammount} readOnly />
            </Form.Group>
          </div>
          <div class="col">
            <Form.Group className=" mb-3" controlId="phone">
              <Form.Label>Limite</Form.Label>
              <Form.Control type="limit" value={limit} readOnly />
            </Form.Group>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Cliente</Form.Label>
              <Form.Control value={nameCustomer} readOnly />
            </Form.Group>
          </div>
          <div class="col">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Saldo</Form.Label>
              <Form.Control value={nameCustomer} readOnly />
            </Form.Group>
          </div>
          <div class="col">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Monto</Form.Label>
              <Form.Control value={nameCustomer} readOnly />
            </Form.Group>
          </div>
        </div>
      </Form>
      <h1>Detalle de credito</h1>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Pedidos">
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Numero</th>
                  <th>Monto</th>
                  <th>Limite</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.customerId.name}</td>
                    <td>{user.num}</td>
                    <td>{user.ammount}</td>
                    <td>{user.limit}</td>
                    <td>
                      <Button
                        type="button"
                        variant="success"
                        onClick={() => navigate(`/admin/customer/${user._id}`)}
                      >
                        <i className="fas fa-user-edit"></i>
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(user)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Tab>
        <Tab eventKey="profile" title="Pagos">
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Numero</th>
                  <th>Monto</th>
                  <th>Limite</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.customerId.name}</td>
                    <td>{user.num}</td>
                    <td>{user.ammount}</td>
                    <td>{user.limit}</td>
                    <td>
                      <Button
                        type="button"
                        variant="success"
                        onClick={() => navigate(`/admin/customer/${user._id}`)}
                      >
                        <i className="fas fa-user-edit"></i>
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => deleteHandler(user)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Tab>
        <Tab eventKey="contact" title="Confifurar Pagos">
          <Form>
            <div class="row">
              <div class="col">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Fecha apartir de hoy</Form.Label>
                </Form.Group>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div class="col">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Cliente</Form.Label>

                  <Form.Control type="Ammount" value={ammount} readOnly />
                </Form.Group>
              </div>
              <div class="col">
                <Form.Group className=" mb-3" controlId="phone">
                  <Form.Label>Limite</Form.Label>
                  <Form.Control type="limit" value={limit} readOnly />
                </Form.Group>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Cliente</Form.Label>
                  <Form.Control value={nameCustomer} readOnly />
                </Form.Group>
              </div>
              <div class="col">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Saldo</Form.Label>
                  <Form.Control value={nameCustomer} readOnly />
                </Form.Group>
              </div>
              <div class="col">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Monto</Form.Label>
                  <Form.Control value={nameCustomer} readOnly />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Tab>
      </Tabs>
    </div>
  );
}
