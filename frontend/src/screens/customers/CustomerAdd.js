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

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function CustomerAdd() {
  debugger;
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {});
  //   useEffect(() => {
  //     debugger;
  //     const fetchData = async () => {
  //       try {
  //         dispatch({ type: "FETCH_REQUEST" });
  //         const { data } = await axios.get(`/api/users/${userId}`, {
  //           headers: { Authorization: `Bearer ${userInfo.token}` },
  //         });
  //         setName(data.name);
  //         setEmail(data.email);
  //         setIsAdmin(data.isAdmin);
  //         dispatch({ type: "FETCH_SUCCESS" });
  //       } catch (err) {
  //         dispatch({
  //           type: "FETCH_FAIL",
  //           payload: getError(err),
  //         });
  //       }
  //     };
  //     fetchData();
  //   }, [userId, userInfo]);

  const CustomerAddHandler = async () => {
    debugger;
    try {
      dispatch({ type: "FETCH_SUCCESS" });

      const { data } = await axios.post(
        "/api/customers",
        {
          name: name,
          email: email,
          phone: phone,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      dispatch({ type: "FETCH_SUCCESS" });
      toast.success("Cliente creado");
      navigate("/admin/customers");
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User</title>
      </Helmet>
      <h1>Nuevo Cliente </h1>
      <Form onSubmit={CustomerAddHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Telefono</Form.Label>
          <Form.Control
            type="phone"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit" variant="outline-primary">
            Crear
          </Button>
        </div>
      </Form>
    </Container>
  );
}
