import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { useAuth } from "../firebase/auth";
import Loader from "@/components/Loader";
import Link from "next/link";

const LoginForm = () => {
	const router = useRouter();
	const provider = new GoogleAuthProvider();

	const [password, setPassword] = useState(null);
	const [email, setEmail] = useState(null);
	const [error, setError] = useState("");
	const { authUser, isLoading } = useAuth();

	const loginHandler = async () => {
		if (!email || !password) return;
		try {
			const user = await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			setError(error.message);
			console.log(error.message,'error');
		}
		setTimeout(() => {
			setError("");
		}, 5000);
	};
	useEffect(() => {
		if (!isLoading && authUser) {
			router.push("/");
		}
	}, [isLoading,authUser]);

	const signInwithGoogle = async () => {
		try {
			const user = await signInWithPopup(auth, provider);
		} catch (error) {
			console.error(error);
		}
	};
	return isLoading || (!isLoading && !!authUser) ? (
		<Loader />
	) : (
		<main className="flex lg:h-[100vh]">
			<div className="w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start">
				<div className="p-8 w-[600px]">
					<h1 className="text-6xl font-semibold">Login</h1>
					<p className="mt-6 ml-1">
						Don't have an account ? <Link href="/register" className="underline hover:text-blue-400 cursor-pointer">Sign Up</Link>
					</p>
					<div
						className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
						onClick={signInwithGoogle}
					>
						<FcGoogle size={22} />
						<span className="font-medium text-black group-hover:text-white">Login with Google</span>
					</div>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="mt-10 pl-1 flex flex-col">
							<label>Email</label>
							<input
								type="text"
								className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="mt-10 pl-1 flex flex-col">
							<label>Password</label>
							<input
								type="password"
								className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5" role="alert">
						<strong class="font-bold">Hey, </strong>
						<span class="block sm:inline">{error}</span>
						<span class="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={()=>setError("")} >
							<svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
						</span>
						</div>}
						<button
							className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90"
							onClick={loginHandler}
						>
							Sign in
						</button>
						
					</form>
				</div>
			</div>
			<div
				className="w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
				style={{
					backgroundImage: "url('/notes-2208049_1920.jpg')",
				}}
			></div>
		</main>
	);
};

export default LoginForm;
