import { getAllCategories } from "@/actions/categories";
import { getData } from "@/actions/todoAction";
import Categories from "@/components/categories";
import Todos from "@/components/todos";

export default async function Home() {
  const data = await getData();
  const CatData = await getAllCategories();
  // return <Todos todos={data} />;
  return <Categories initialCategories={CatData} />;
}
