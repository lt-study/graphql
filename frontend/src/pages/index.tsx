import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{data, fetching}] = usePostsQuery();
  return (
    <>
      <NavBar></NavBar>
      <div>
        {fetching ? <div>Loading</div> : (!data ? null: data.posts.map(p => <div key={p.id}>{p.title}</div>))}
      </div>
    </>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
