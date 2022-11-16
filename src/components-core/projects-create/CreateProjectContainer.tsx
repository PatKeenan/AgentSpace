import { Breadcrumb } from "components-layout/Breadcrumb";
import { PageBody } from "components-layout/PageBody";
import { SectionHeading } from "components-layout/SectionHeading";
import { useWorkspace } from "hooks/useWorkspace";
import { RadioGroup } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Button } from "components-common/Button";
import React from "react";
import { NextPageExtended } from "types/index";

export const CreateProjectContainer: NextPageExtended = () => {
    const workspace = useWorkspace();
    const [selected, setSelected] = React.useState(settings[0]);
    return (
        <>
            <Breadcrumb
                items={[
                    {
                        title: "Projects",
                        href: `/workspace/${workspace.id}/projects`,
                    },
                    {
                        title: "Create",
                        href: `/workspace/${workspace.id}/projects/create`,
                    },
                ]}
            />
            <PageBody>
                <SectionHeading>
                    <SectionHeading.TitleContainer>
                        <SectionHeading.Title>
                            Create Project
                        </SectionHeading.Title>
                    </SectionHeading.TitleContainer>
                </SectionHeading>
                <form className="max-w-3xl">
                    <div className="space-y-6">
                        <div>
                            <p className="mt-1 text-sm text-gray-500">
                                Let’s get started by filling in the information
                                below to create your new project.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="project-name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Project Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="project-name"
                                    id="project-name"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    defaultValue="Project Nero"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    defaultValue={""}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="space-y-1">
                                <label
                                    htmlFor="add-team-members"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Add Contacts
                                </label>
                                <p
                                    id="add-team-members-helper"
                                    className="sr-only"
                                >
                                    Search by display name or email
                                </p>
                                <div className="flex">
                                    <div className="flex-grow">
                                        <input
                                            type="text"
                                            name="add-team-members"
                                            id="add-team-members"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Email address"
                                            aria-describedby="add-team-members-helper"
                                        />
                                    </div>
                                    <span className="ml-3">
                                        <Button variant="outlined">
                                            <PlusIcon
                                                className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <span>Add</span>
                                        </Button>
                                    </span>
                                </div>
                            </div>

                            <div className="border-b border-gray-200">
                                <ul
                                    role="list"
                                    className="divide-y divide-gray-200"
                                >
                                    {team.map((person) => (
                                        <li
                                            key={person.email}
                                            className="flex py-4"
                                        >
                                            {/*  <img
                                                className="h-10 w-10 rounded-full"
                                                src={person.imageUrl}
                                                alt=""
                                            /> */}
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {person.name}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {person.email}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <RadioGroup value={selected} onChange={setSelected}>
                            <RadioGroup.Label className="text-sm font-medium text-gray-900">
                                Project Type
                            </RadioGroup.Label>

                            <div className="isolate mt-1 -space-y-px rounded-md bg-white shadow-sm">
                                {settings.map((setting, settingIdx) => (
                                    <RadioGroup.Option
                                        key={setting.name}
                                        value={setting}
                                        className={({ checked }) =>
                                            clsx(
                                                settingIdx === 0
                                                    ? "rounded-tl-md rounded-tr-md"
                                                    : "",
                                                settingIdx ===
                                                    settings.length - 1
                                                    ? "rounded-bl-md rounded-br-md"
                                                    : "",
                                                checked
                                                    ? "z-10 border-indigo-200 bg-indigo-50"
                                                    : "border-gray-200",
                                                "relative flex cursor-pointer border p-4 focus:outline-none"
                                            )
                                        }
                                    >
                                        {({ active, checked }) => (
                                            <>
                                                <span
                                                    className={clsx(
                                                        checked
                                                            ? "border-transparent bg-indigo-600"
                                                            : "border-gray-300 bg-white",
                                                        active
                                                            ? "ring-2 ring-indigo-500 ring-offset-2"
                                                            : "",
                                                        "mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border"
                                                    )}
                                                    aria-hidden="true"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                                </span>
                                                <span className="ml-3 flex flex-col">
                                                    <RadioGroup.Label
                                                        as="span"
                                                        className={clsx(
                                                            checked
                                                                ? "text-indigo-900"
                                                                : "text-gray-900",
                                                            "block text-sm font-medium"
                                                        )}
                                                    >
                                                        {setting.name}
                                                    </RadioGroup.Label>
                                                    <RadioGroup.Description
                                                        as="span"
                                                        className={clsx(
                                                            checked
                                                                ? "text-indigo-700"
                                                                : "text-gray-500",
                                                            "block text-sm"
                                                        )}
                                                    >
                                                        {setting.description}
                                                    </RadioGroup.Description>
                                                </span>
                                            </>
                                        )}
                                    </RadioGroup.Option>
                                ))}
                            </div>
                        </RadioGroup>

                        <div>
                            <label
                                htmlFor="tags"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button variant="outlined">Cancel</Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="ml-4"
                            >
                                Create this project
                            </Button>
                        </div>
                    </div>
                </form>
            </PageBody>
        </>
    );
};

CreateProjectContainer.layout = "dashboard";

const team = [
    {
        name: "Calvin Hawkins",
        email: "calvin.hawkins@example.com",
        imageUrl:
            "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        name: "Bessie Richards",
        email: "bessie.richards@example.com",
        imageUrl:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
        name: "Floyd Black",
        email: "floyd.black@example.com",
        imageUrl:
            "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
];
const settings = [
    {
        name: "Buyer",
        description:
            "This project would be available to anyone who has the link",
    },
    {
        name: "Seller",
        description: "Only members of this project would be able to access",
    },
    {
        name: "Renter",
        description: "You are the only one able to access this project",
    },
    {
        name: "Landlord",
        description: "You are the only one able to access this project",
    },
];
