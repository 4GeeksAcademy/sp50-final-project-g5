import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext.js"
import { Table, Button, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import "../../styles/reservations.css";

export const Reservations = () => {
  const { store, actions } = useContext(Context);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  actions.removeUnnecessaryItems();


  useEffect(() => {
    const fetchPharmacyOrders = async () => {
      setIsLoading(true);
      await actions.getPharmacyOrders();
      setIsLoading(false);
    };

    fetchPharmacyOrders();
  }, [actions.getPharmacyOrders]);

  useEffect(() => {
    if (!isLoading && Array.isArray(store.ordersToPharmacy) && store.ordersToPharmacy.length === 0) { // Check conditions only after data has loaded
      actions.setNotification('Aún no tiene ningún pedido. Al mantener actualizada su lista de medicamentos disponibles, mejorará su visibilidad. ¡Actúe ahora para atraer a más pacientes!', 'info');
    }
  }, [store.ordersToPharmacy, isLoading, actions.setNotification]);


  const ordersToPharmacy = Array.isArray(store.ordersToPharmacy) ? store.ordersToPharmacy : [];


  //count Pendientes to show as badge
  const pendienteCount = ordersToPharmacy.filter(order => order.order_status === 'Pendiente').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente':
        return <Badge pill bg="" className="badge-soft-warning p-2">Pendiente</Badge>;
      case 'Aceptada':
        return <Badge pill bg="" className="badge-soft-success p-2">Aceptada</Badge>;
      case 'Rechazada':
        return <Badge pill bg="" className="badge-soft-danger p-2">Cancelada</Badge>;
      case 'Recogida':
        return <Badge pill bg="" className="badge-soft-info p-2">Recogida</Badge>;
      default:
        return <Badge pill bg="" className="badge-soft-secondary p-2">Desconocido</Badge>;
    }
  };

  const handleAcceptOrder = async (orderId) => {
    console.log("Accepting order with status: Aceptada");
    await actions.updateOrderStatus(orderId, "ACCEPTED");
    actions.getPharmacyOrders()
    actions.setNotification('Ha aceptado la reserva con éxito', 'success');
    window.scrollTo(0, 0);
  //   actions.sendOrderAcceptanceEmail("xxxx@gmail.com"); //I deleted the email for now
  //   try {
  //     await actions.sendOrderAcceptanceEmail("xxxxx@gmail.com"); // //I deleted the email for now
  //     console.log("Email sent successfully");
  // } catch (error) {
  //     console.error("Error sending email:", error);
  // }
};

  const handleCancelOrder = (orderId) => {
    console.log("Cancelling order with status: Rechazada");
    actions.updateOrderStatus(orderId, "REJECTED");
    actions.getPharmacyOrders()
    actions.setNotification('Ha cancelado la reserva con éxito', 'success');
    window.scrollTo(0, 0);

  };


  const handlePickupOrder = (orderId) => {
    console.log("Marking order as picked up");
    actions.updateOrderStatus(orderId, "COMPLETED");
    actions.getPharmacyOrders()
    actions.setNotification('Ha marcado la reserva como recogida', 'success');
    window.scrollTo(0, 0);
    setShowModal(true);

  };

  const navigateToAvailability = () => {
    navigate('/pharmacy/availability');
  };

  const handleFilterClick = (status) => {
    setFilter(status);
  };

  const filteredOrders = ordersToPharmacy.filter(order => filter === '' || order.order_status === filter);


  return (
    <div className="orders-container">
      <div className="filters-container d-flex flex-column align-items-center mb-3">
        <span className="filter-text mb-2">Filtros:</span>
        <div className="pills-menu-style d-flex justify-content-center">
          <Badge pill bg="" className="badge-soft-warning filter-badge mx-2 p-2" onClick={() => handleFilterClick('Pendiente')} style={{ cursor: 'pointer' }}> Pendiente {pendienteCount > 0 && (
            <Badge pill bg="danger" className="position-absolute badge-notification">{pendienteCount}</Badge>)}</Badge>
          <Badge pill bg="" className="badge-soft-success filter-badge mx-2 p-2" onClick={() => handleFilterClick('Aceptada')} style={{ cursor: 'pointer' }}>Aceptada</Badge>
          <Badge pill bg="" className="badge-soft-danger filter-badge mx-2 p-2" onClick={() => handleFilterClick('Rechazada')} style={{ cursor: 'pointer' }}>Cancelada</Badge>
          <Badge pill bg="" className="badge-soft-info filter-badge mx-2 p-2" onClick={() => handleFilterClick('Recogida')} style={{ cursor: 'pointer' }}>Recogida</Badge>
          <Badge pill bg="" className="badge-soft-secondary filter-badge mx-2 p-2" onClick={() => setFilter('')} style={{ cursor: 'pointer' }}>Mostrar Todo</Badge>
        </div>
      </div>
      <div className="table-container hover-shadow">
        <Table table-style>
          <thead className="table-head-style">
            <tr>
              <th className="table-cell header" style={{ color: "#3ab0a7", }}>Reserva</th>
              <th className="table-cell header" style={{ color: "#00c895", }}>Medicamento</th>
              <th className="table-cell header" style={{ color: "#00a747", }}>Paciente</th>
              {/* <th className="table-cell header" style={{ color: "#3ab0a7", }}>Tiempo de reserva</th> */}
              <th className="table-cell header" style={{ color: "#3ab0a7", }}>Estado</th>
              <th className="table-cell header" style={{ color: "#007085", }}>Acción</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredOrders.map((reservation, index) => (
              <tr key={index}>
                <td className="table-cell body-row order-nr"># {reservation.id}</td>
                <td className="table-cell body-row">{reservation.medicine.medicine_name}</td>
                <td className="table-cell body-row">{reservation.patient ? reservation.patient.name : 'N/A'}</td>
                {/* <td className="table-cell body-row">Tiene 24h para recoger el medicamento</td> */}
                <td className="table-cell body-row">{getStatusBadge(reservation.order_status)}</td>
                <td className="table-cell body-row">
                  {reservation.order_status === 'Pendiente' && (
                    <div className="btn-container d-flex flex-row align-items-center mb-3">
                      <Button variant="" className="btn-accept me-2" onClick={() => handleAcceptOrder(reservation.id, 'Aceptada')}>Aceptar</Button>
                      <Button variant="" className="btn-reject" onClick={() => handleCancelOrder(reservation.id, 'Rechazada')}>Cancelar</Button>
                    </div>
                  )}
                  {reservation.order_status === 'Aceptada' && (
                    <>
                      <Button variant="" className="btn-pickup" onClick={() => handlePickupOrder(reservation.id, 'Recogida')}>Recogida</Button>
                      <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header  className="header-modal" closeButton>
                          <Modal.Title className="text-center">¿Actualizar Disponibilidad?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="body-modal-reserv">
                          ¿Te quedan unidades de este medicamento?
                        </Modal.Body>
                        <Modal.Footer className="footer-modal-reserv">
                          <Button variant="secondary" className="mt-2" onClick={() => setShowModal(false)}>
                          Aún me quedan
                          </Button>
                          <Button variant="" className="mt-2 btn-confirm" onClick={navigateToAvailability}>
                          Actualizo la disponibilidad
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};