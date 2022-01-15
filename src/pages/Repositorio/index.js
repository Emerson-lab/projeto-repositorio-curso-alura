import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList,
} from "./styles";
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function Repositorio({ match }) {
  const [repositorio, setRepositorio] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    { state: "all", label: "Todas", action: false },
    { state: "open", label: "Fechads", action: false },
    { state: "closed", label: "Abertas", action: true },
  ]);
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: filters.find((f) => f.action).state,
            per_page: 5,
          },
        }),
      ]);
      setRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [match.params.repositorio]);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = decodeURIComponent(match.params.repositorio);

      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5,
        },
      });
      setIssues(response.data);
    }
    loadIssue();
  }, [filterIndex, match.params.repositorio, page]);

  function handlePage(action) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index) {
    setFilterIndex(index);
  }

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
        <FilterList active={filterIndex}>
          {filters.map((filter, index) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => handleFilter(index)}
            >
              {filter.label}
            </button>
          ))}
        </FilterList>
        <IssuesList>
          <ul>
            {issues.map((item) => (
              <li key={String(item.id)}>
                <img src={item.user.avatar_url} alt={item.user.login} />
                <div>
                  <strong>
                    <a href={item.html_url}>{item.title}</a>
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
        <PageActions>
          <>
            <button
              type="button"
              disabled={page === 1 ? true : false}
              onClick={() => handlePage("back")}
            >
              Voltar
            </button>
            <p>Página {page}</p>
            <button type="button" onClick={() => handlePage("next")}>
              Próxima
            </button>
          </>
        </PageActions>
      </Container>
    </div>
  );
}
