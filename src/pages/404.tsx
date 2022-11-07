import { ButtonLink } from "components-common/Button";
import { NextLink } from "components-common/NextLink";

const Custom404 = () => {
    return (
        <div className="grid h-full place-items-center">
            <div className="flex flex-col justify-center">
                <h3 className="text-2xl">404 Not Found</h3>
                <ButtonLink
                    variant="primary"
                    href="/"
                    className="mt-4 justify-center"
                >
                    Go Home
                </ButtonLink>
            </div>
        </div>
    );
};

export default Custom404;
