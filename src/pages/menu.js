import React, { useEffect, useState } from "react";
import { Table, Card, Image, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import firestoreService from "../utilities/services/firestoreService";

function Menu(props) {
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    firestoreService
      .getAllMenuItems()
      .then((response) => {
        setMenuItems(response._delegate._snapshot.docChanges);
      })
      .catch((e) => {
        alert("Error occured while fetching the menu item. " + e);
      });
  }, []);

  return (
    <>
      <Card style={{ margin: 24 }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="align-items-center" style={{ marginRight: 8 }}>
            <FontAwesomeIcon icon={faSeedling} size="6x"></FontAwesomeIcon>
            Dixon's Fresh Foods
            <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
              5555 Where Ever Street, Indianapolis, IN 46077
            </p>
          </div>
          <Button style={{ backgroundColor: "#BD2B2B", borderWidth: 0 }}>
            Place Order
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
                      {
                        menuItem.doc.data.value.mapValue.fields.itemPrice
                          .stringValue
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
            © 2022 Dixon's Fresh Foods
          </p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
            <a href="/login">Admin Login</a> • <a href="#">Privacy Policy</a> •{" "}
            <a href="#">Directions</a> • <a href="#">Contact Us</a>
          </p>
        </Card.Footer>
      </Card>
    </>
  );
}
export default Menu;
