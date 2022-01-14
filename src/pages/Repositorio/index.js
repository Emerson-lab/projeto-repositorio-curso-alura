import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Container, Owner, Loading } from "./styles";

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
      setIssues(issuesData);
      setLoading(false);
    }
    load();
  }, [match.params.repositorio]);

  if(loading) {
    return (
      <Loading>
        Carregando...
      </Loading>
    )
  }

  return (
    <div>
      <Container>
        <Owner>
          <img
            src={repositorio.owner.avatar_url}
            alt={repositorio.owner.login}
          />
          <h1>{repositorio.name}</h1>
          <p>{repositorio.description}</p>
        </Owner>
      </Container>
    </div>
  );
}
