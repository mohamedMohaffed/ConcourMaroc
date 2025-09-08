
import { useApi } from '../../../hooks/useApi';

const useQuizData = (niveau_slug, universite_slug, year_slug, subject_slug, quizMode) => {
  const { data, error, loading } = useApi(
    `/concour/${niveau_slug}/${universite_slug}/${year_slug}/${subject_slug}/concour/?mode=${quizMode}`
  );
  
  return { data, error, loading };
};

export default useQuizData;