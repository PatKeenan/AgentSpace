import { useAppointmentsUI } from "../useAppointmentsUI";

import { Modal } from "components-common";

import { AppointmentForm } from "./AppointmentForm";

export const AppointmentModal = () => {
    const { resetModal, modal } = useAppointmentsUI();

    const handleClose = () => {
        resetModal();
    };

    const handleSuccess = () => resetModal();

    /////////////////////////////////////////////////////////////
    return (
        <Modal open={modal.state || false} onClose={handleClose}>
            <AppointmentForm
                defaultData={modal.defaultData}
                selectedDate={modal.selectedDate}
                onSuccess={handleSuccess}
                onCancel={handleClose}
            />
        </Modal>
    );
};
