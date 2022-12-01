import {
    EnvelopeIcon,
    PencilIcon,
    PhoneIcon,
    TrashIcon,
} from "@heroicons/react/20/solid";
import { Button } from "components-common/Button";
import { SectionHeading } from "components-layout/SectionHeading";
import { useContacts } from "hooks/useContacts";
import { useRouter } from "next/router";
import { exists } from "utils/helpers";
import { useContactDetailUi } from "../useContactDetailUi";

export const ContactDetailOverviewTitle = () => {
    const { getOne } = useContacts();
    const router = useRouter();
    const id = router.query.contactId;

    const { data: contact, isLoading: loadingPerson } = getOne(
        { id: router.query.contactId as string, displayName: true },
        {
            enabled: exists(id),
        }
    );

    const { setModal } = useContactDetailUi();

    const handleClickEdit = () => {
        if (contact?.displayName) {
            setModal({
                state: true,
                form: "contact",
                defaultData: {
                    displayName: contact.displayName,
                    notes: contact?.notes || undefined,
                },
            });
        }
    };

    return (
        <SectionHeading>
            <SectionHeading.TitleContainer>
                <SectionHeading.Title>
                    {contact?.displayName ?? "Contact Details"}
                </SectionHeading.Title>
            </SectionHeading.TitleContainer>
            <SectionHeading.Actions>
                <div className="flex flex-shrink-0 items-center space-x-2">
                    <Button
                        variant="outlined"
                        type="button"
                        onClick={() => handleClickEdit()}
                    >
                        <PencilIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        <span>Edit</span>
                    </Button>
                    <Button variant="outlined" type="button">
                        <TrashIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                        <span>Delete</span>
                    </Button>
                </div>
            </SectionHeading.Actions>
        </SectionHeading>
    );
};
