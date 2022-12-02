import { SidebarList } from "./SidebarList";

export const ContactTagsList = ({ contactId }: { contactId: string }) => {
    return (
        <SidebarList
            title="Tags"
            buttonTitle="View All"
            onClick={() => {
                alert("Hello");
            }}
            data={[{ id: "1", name: "cool", beans: "neat" }]}
            renderItem={(i) => <div>{i.beans}</div>}
        />
    );
};
