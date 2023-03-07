import { useRouter } from "@/router"

/*
  Returns the router functions
*/
export default function () {
    const router = useRouter();

    const routeTo = (name: string) => {
        if (name) {
            router.push(name)
        }
    }
    return {
        routeTo
    }
}