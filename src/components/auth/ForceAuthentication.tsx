import Head from "next/head";
import Image from "next/image";
import load from "../../../public/images/load.gif";
import useAuth from "../../data/hook/useAuth";
import router from "next/router";

export default function ForceAuthentication(props) {

  const { user, loading } = useAuth()

  function renderContent() {
    return (
      <>
        <Head>
          <script 
            dangerouslySetInnerHTML={{
              __html: `
                if(!document.cookie?.includes("admin-template-341a4-auth")) {
                  window.location.href = "/authentication"
                }
              `
            }}
          />
        </Head>
        {props.children}
      </>
    )
  }

  function renderLoading() {
    return (
      <div className={`
        flex justify-center items-center h-screen
      `}>
        <Image src={load} alt="loading" />
      </div>
    )
  }


  if(!loading && user?.email) {
    return renderContent()
  } else if(loading) {
    return renderLoading()
  } else {
    router.push('/authentication')
    return null
  }
}