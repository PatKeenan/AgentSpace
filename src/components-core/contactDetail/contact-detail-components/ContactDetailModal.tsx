import { useContactDetailUi } from "../useContactDetailUi";
import { SubRouter } from "components-common/SubRouter";
import { Modal } from "components-common/Modal";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const AddProfileForm = dynamic(() => import("./AddProfileForm"), {
    suspense: true,
    ssr: false,
});
const EditContactForm = dynamic(() => import("./EditContactForm"), {
    suspense: true,
    ssr: false,
});
const SubContactForm = dynamic(() => import("./SubContactForm"), {
    suspense: true,
    ssr: false,
});

const EditGeneralInfoForm = dynamic(() => import("./EditGeneralInfoForm"), {
    suspense: true,
    ssr: false,
});

export const ContactDetailModal = () => {
    const { modal, resetModal } = useContactDetailUi();

    return (
        <Modal
            open={modal.state || false}
            onClose={resetModal}
            showInnerContainer={modal.form !== undefined}
        >
            <Suspense fallback={<>Loading..</>}>
                <SubRouter
                    component={<EditContactForm />}
                    active={modal?.form == "contact"}
                />
                <SubRouter
                    component={<SubContactForm />}
                    active={modal?.form == "subContact"}
                />
                <SubRouter
                    component={<AddProfileForm />}
                    active={modal?.form == "profile"}
                />
                <SubRouter
                    component={<EditGeneralInfoForm />}
                    active={modal?.form == "generalInfo"}
                />
            </Suspense>
        </Modal>
    );
};
