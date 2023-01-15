import { ContactSingleton, ContactSingletonType } from "lib/ContactSingleton";
import { InputGroup } from "components-common/InputGroup";
import { useContactDetailUi } from "../useContactDetailUi";
import { ModalTitle } from "components-common/ModalTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components-common/Button";
import { useContacts } from "hooks/useContacts";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const { contactFormFields } = ContactSingleton;

export default function EditGeneralInfoForm() {
    const { modal, resetModal } = useContactDetailUi();
    const router = useRouter();
    const id = router.query.contactId;
    const { update, utils } = useContacts();
    const { mutate: updateContact } = update();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Pick<ContactSingletonType["contactSchemas"]["base"], "name">>({
        resolver: zodResolver(
            ContactSingleton.contactSchemas.update.pick({ name: true })
        ),
        defaultValues:
            modal.form == "generalInfo"
                ? (modal.defaultData as Pick<
                      ContactSingletonType["contactSchemas"]["update"],
                      "name"
                  >)
                : undefined,
    });

    const onSubmit = handleSubmit(async (data) => {
        if (id) {
            updateContact(
                { ...data, id: id as string },
                {
                    onSuccess: (data) => {
                        utils.getName.invalidate({ id: data.id });
                        resetModal();
                    },
                }
            );
        }
    });

    return (
        <form onSubmit={onSubmit}>
            <ModalTitle>Edit General Info</ModalTitle>
            <div className="mt-6">
                <InputGroup
                    label={contactFormFields.name.label}
                    {...register("name")}
                    direction="column"
                    errorMessage={errors && errors.name && errors.name.message}
                />
            </div>
            <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outlined" onClick={resetModal}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </form>
    );
}
