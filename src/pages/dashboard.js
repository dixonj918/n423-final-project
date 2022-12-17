import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Image,
  Button,
  Modal,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import NotLoggedInView from "../components/NoLoggedInView";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firestoreService from "../utilities/services/firestoreService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";

function Dashboard(props) {
  function FetchMenuCategories() {
    firestoreService
      .getAllMenuCategories()
      .then((response) => {
        setMenuCategories(response._delegate._snapshot.docChanges);
      })
      .catch((e) => {
        alert("Error occured while getting the menu categories" + e);
      });
  }

  function FetchMenuItems() {
    firestoreService
      .getAllMenuItems()
      .then((response) => {
        setMenuItems(response._delegate._snapshot.docChanges);
      })
      .catch((e) => {
        alert("Error occured while getting the menu item." + e);
      });
  }

  const [currentMenuItem, setCurrentMenuItem] = useState({
    itemName: "",
    itemCategory: "",
    itemPrice: 0,
  });
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [user, setUser] = useState(null);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });
  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [addEditFormType, setAddEditFormType] = useState("Add");
  const [validated, setValidated] = useState(false);
  const [currentMenuItemId, setCurrentMenuItemId] = useState("");
  const handleModalClose = () => {
    setAddEditFormType("Add");
    setCurrentMenuItemId("");
    setCurrentMenuItem({ itemName: "", itemCategory: "", itemPrice: 0 });
    setShowDeleteDialogue(false);
    setShowAddEditForm(false);
  };

  const handleMenuItemDelete = () => {
    firestoreService
      .DeleteMenuItem(currentMenuItemId)
      .then(() => {
        alert(`Deletion Successful`);
        handleModalClose();
        window.location.reload(false);
      })
      .catch((e) => {
        alert("Error occured: " + e.message);
      });
  };
  const handleAddEditFormSubmit = (e) => {
    e.preventDefault();

    const { itemName, itemCategory, itemPrice } = e.target.elements;
    if (itemPrice.value && itemName.value) {
      if (addEditFormType === "Add") {
        firestoreService
          .AddNewMenuItem(itemName.value, itemCategory.value, itemPrice.value)
          .then(() => {
            alert(`${itemName.value} is successfully added to the menu.`);
            setCurrentMenuItem({
              itemName: "",
              itemCategory: "",
              itemPrice: 0,
            });
            handleModalClose();
            window.location.reload(false);
          })
          .catch((e) => {
            alert("Error occured: " + e.message);
          });
      }
    }
    if (addEditFormType === "Edit") {
      firestoreService
        .UpdateMenuItem(
          currentMenuItemId,
          itemName.value,
          itemCategory.value,
          itemPrice.value
        )
        .then(() => {
          alert(`${itemName.value} is successfully updated.`);
          setCurrentMenuItemId("");
          setCurrentMenuItem({ itemName: "", itemCategory: "", itemPrice: 0 });
          handleModalClose();
          window.location.reload(false);
        })
        .catch((e) => {
          alert("Error occured: " + e.message);
        });
    }
  };

  useEffect(() => {
    if (user !== null) {
      if (menuCategories.length <= 0) {
        FetchMenuCategories();
      }
      FetchMenuItems();
    }
  }, [user]);

  return (
    <>
      <FloatingLabel
        controlId="itemCategory"
        label="Item Category"
        className="mb-3"
      >
        <Form.Select>
          {menuCategories &&
            menuCategories.map((menuCategory, index) => (
              <option
                key={index}
                value={
                  menuCategory.doc.data.value.mapValue.fields.catName
                    .stringValue
                }
              >
                {
                  menuCategory.doc.data.value.mapValue.fields.catName
                    .stringValue
                }
              </option>
            ))}
        </Form.Select>
      </FloatingLabel>

      <Modal show={showDeleteDialogue} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Menu Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this menu item?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleMenuItemDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddEditForm} onHide={handleModalClose}>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleAddEditFormSubmit}
        >
          <Modal.Header>
            <Modal.Title>
              {addEditFormType === "Add" ? "Add Menu Item" : "Edit"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel
              controlId="itemName"
              label="Item Name"
              className="mb-3"
            >
              <Form.Control
                required
                type="text"
                placeholder="Enter item name"
                size="md"
                value={currentMenuItem?.itemName}
                onChange={(e) => {
                  setCurrentMenuItem({
                    itemName: e.target.value ? e.target.value : "",
                    itemCategory: currentMenuItem?.itemCategory,
                    itemPrice: currentMenuItem?.itemPrice,
                  });
                }}
              />

              <Form.Control.Feedback type="invalid">
                Item name is required
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel
              controlId="itemCategory"
              label="Item Category"
              className="mb-3"
            >
              <Form.Select
                value={currentMenuItem?.itemCategory}
                onChange={(e) => {
                  setCurrentMenuItem({
                    itemName: currentMenuItem?.itemName,
                    itemCategory: e.target.value,
                    itemPrice: currentMenuItem?.itemPrice,
                  });
                }}
              >
                {menuCategories &&
                  menuCategories.map((menuCategory, index) => (
                    <option
                      key={index}
                      value={
                        menuCategory.doc.data.value.mapValue.fields.catName
                          .stringValue
                      }
                    >
                      {
                        menuCategory.doc.data.value.mapValue.fields.catName
                          .stringValue
                      }
                    </option>
                  ))}
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
              controlId="itemPrice"
              label="Price (USD)"
              className="mb-3"
            >
              <Form.Control
                required
                type="text"
                placeholder="Enter item price"
                size="md"
                value={currentMenuItem?.itemPrice}
                onChange={(e) => {
                  setCurrentMenuItem({
                    itemName: currentMenuItem?.itemName,
                    itemCategory: currentMenuItem?.itemCategory,
                    itemPrice: e.target.value,
                  });
                }}
              />

              <Form.Control.Feedback type="invalid">
                Item Price is required
              </Form.Control.Feedback>
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">
              {addEditFormType === "Add" ? "Add" : "Update"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Card style={{ margin: 24 }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="align-items-center" style={{ marginRight: 8 }}>
            <FontAwesomeIcon icon={faSeedling} size="6x"></FontAwesomeIcon>
            Dixon's Fresh Foods
            <h4 style={{ marginTop: 8 }}>Dashboard</h4>
          </div>
          <Button
            style={{ backgroundColor: "#000", borderWidth: 0 }}
            onClick={() => {
              setShowAddEditForm(true);
            }}
          >
            Add New Item
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Price (USD)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {menuItems &&
                menuItems.map((menuItem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {
                        menuItem.doc.data.value.mapValue.fields.itemName
                          .stringValue
                      }
                    </td>
                    <td>
                      {
                        menuItem.doc.data.value.mapValue.fields.itemCategory
                          .stringValue
                      }
                    </td>
                    <td>
                      {menuItem.doc.data.value.mapValue.fields.itemPrice
                        .stringValue
                        ? menuItem.doc.data.value.mapValue.fields.itemPrice
                            .stringValue
                        : menuItem.doc.data.value.mapValue.fields.itemPrice
                            .stringValue}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setCurrentMenuItemId(
                            menuItem.doc.key.path.segments[
                              menuItem.doc.key.path.segments.length - 1
                            ]
                          );
                          setCurrentMenuItem({
                            itemName:
                              menuItem.doc.data.value.mapValue.fields.itemName
                                .stringValue,
                            itemCategory:
                              menuItem.doc.data.value.mapValue.fields
                                .itemCategory.stringValue,
                            itemPrice: menuItem.doc.data.value.mapValue.fields
                              .itemPrice.stringValue
                              ? menuItem.doc.data.value.mapValue.fields
                                  .itemPrice.stringValue
                              : menuItem.doc.data.value.mapValue.fields
                                  .itemPrice.stringValue,
                          });
                          setAddEditFormType("Edit");
                          setShowAddEditForm(true);
                        }}
                      >
                        ✎ Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setCurrentMenuItemId(
                            menuItem.doc.key.path.segments[
                              menuItem.doc.key.path.segments.length - 1
                            ]
                          );
                          setCurrentMenuItem({
                            itemName:
                              menuItem.doc.data.value.mapValue.fields.itemName
                                .stringValue,
                            itemCategory:
                              menuItem.doc.data.value.mapValue.fields
                                .itemCategory.stringValue,
                            itemPrice: menuItem.doc.data.value.mapValue.fields
                              .itemPrice.stringValue
                              ? menuItem.doc.data.value.mapValue.fields
                                  .itemPrice.stringValue
                              : menuItem.doc.data.value.mapValue.fields
                                  .itemPrice.stringValue,
                          });
                          setShowDeleteDialogue(true);
                        }}
                      >
                        x Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
            Dixon's Fresh Foods v1.0.0 - <a href="/login">Logout</a>
          </p>
        </Card.Footer>
      </Card>
    </>
  );
}

export default Dashboard;
