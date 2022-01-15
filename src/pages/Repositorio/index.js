import { Container, Owner, Loading, BackButton, IssuesList } from "./styles";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function Repositorio({ match }) {
  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: "open",
            per_page: 5,
          },
        }),
      ]);
      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      console.log(issuesData.data);
      setLoading(false);
    }
    load();
  }, [match.params.repositorio]);

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  return (
    <div>
      <Container>
        <BackButton to="/">
          <FaArrowLeft color="#000" size={30} />
        </BackButton>
        <Owner>
          <img
            src={repositorio.owner.avatar_url}
            alt={repositorio.owner.login}
          />
          <h1>{repositorio.name}</h1>
          <p>{repositorio.description}</p>
        </Owner>
        <IssuesList>
          <ul>
            {issues.map((item) => (
              <li key={String(item.id)}>
                <img src={item.user.avatar_url} alt={item.user.login} />
                <div>
                  <strong>
                    <a href={item.html_url} >
                      {item.title}
                    </a>
                    {item.labels.map((label) => (
                      <span key={String(label.id)}>{label.name}</span>
                    ))}
                  </strong>
                  <p>{item.user.login}</p>
                </div>
              </li>
            ))}
          </ul>
        </IssuesList>
      </Container>
    </div>
  );
}
