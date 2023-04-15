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

	const { authUser, isLoading } = useAuth();

	const loginHandler = async () => {
		if (!email || !password) return;
		try {
			const user = await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		if (!isLoading && authUser) {
			router.push("/");
		}
	}, [isLoading,authUser]);

	const signInwithGoogle = async () => {
		try {
			const user = await signInWithPopup(auth, provider);
			console.log(user);
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
					backgroundImage: "url('/login-banner.jpg')",
				}}
			></div>
		</main>
	);
};

export default LoginForm;
