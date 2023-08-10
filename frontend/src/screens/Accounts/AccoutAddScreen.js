import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Store } from "../../Store";
import { getError } from "../utils";
import Modal from "react-bootstrap/Modal";
const reducer = (state, action) => {
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
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function AccoutAddScreen() {
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();
  const [idCustomer, setIdCustomer] = useState("");
  const [nameCustomer, setNameCustomer] = useState("");
  const [num, setNum] = useState("");
  const [ammount, setAmount] = useState("");
  const [limit, setLimit] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const setIdCustomerHandle = async (value) => {
    debugger;
    setIdCustomer(value._id);
    setNameCustomer(value.name);
    setShow(false);
  };
  useEffect(() => {
    debugger;
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/customers`, {
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
  const submitHandler = async (e) => {
    debugger;
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.post(
        "/api/accounts",
        {
          customerId: idCustomer,
          ammount: ammount,
          limit: limit,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("Credito creado");
      navigate("/admin/accounts");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Crear </title>
      </Helmet>
      <h1>Crear Credito</h1>

      <Form>
        <Form.Group className="mb-6" controlId="name">
          <Form.Label>Cliente</Form.Label>
          <Form.Control
            value={nameCustomer}
            onChange={(e) => setNameCustomer(e.target.value)}
            required
          />
          <Button variant="primary" onClick={handleShow}>
            Sellecione el cliente
          </Button>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="Ammount"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Limite</Form.Label>
          <Form.Control
            type="limit"
            onChange={(e) => setLimit(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button onClick={(e) => submitHandler(e)} variant="outline-primary">
            Agregar
          </Button>
        </div>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lista de CLientes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Button
                        type="button"
                        variant="success"
                        onClick={async () => setIdCustomerHandle(user)}
                      >
                        <i className="fas fa-user-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
