import { ButtonLink } from "components-common/Button";

const Unauthorized = () => {
    return (
        <div className="grid h-full place-items-center text-2xl">
            <div className="flex flex-col">
                <h3 className="text-2xl">
                    You&apos;re Not Allowed to see this page
                </h3>
                <div className="mx-auto">
                    <ButtonLink
                        variant="primary"
                        href="/"
                        className="mt-4 justify-center"
                    >
                        Go Back Home
                    </ButtonLink>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
