import { logout } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import { validateRequest } from "@/lib/auth"
import Link from "next/link"

export default async function Home() {

  const { user } = await validateRequest()

  return (
    <>
      {user ? (
        <>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <div className="flex flex-row gap-2">
            {user.role == 'user' ? (
              <>
                <Link href="/posts/timeline"><Button>Questions</Button></Link>
                <Link href="/student/profile"><Button>Profile</Button></Link>
              </>
            ) : (
              <Link href="/dashboard"><Button>Dashboard</Button></Link>
            )}
            <form action={logout}>
              <Button>Sign out</Button>
            </form>
          </div>
        </>
      ) : (
        <Link href='/auth'>
          <Button>Auth</Button>
        </Link>
      )}
    </>
  )
}