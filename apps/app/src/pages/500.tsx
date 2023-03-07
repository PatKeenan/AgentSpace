import Link from "next/link";

export default function Custom500() {
    return (
        <div className="grid h-screen w-screen place-items-center">
            <div>
                <h1 className="mb-4">500 - Server-side error occurred</h1>
                <Link href={"/"} passHref>
                    <a className="underline">Go To Home Page</a>
                </Link>
            </div>
        </div>
    );
}
