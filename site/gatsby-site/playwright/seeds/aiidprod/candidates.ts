import { Candidate } from "../../../server/generated/graphql";

export type DBCandidate = Candidate;

const dates = Array(3)
  .fill(null, 0, 3)
  .map((e, i) => {
    const newDate = new Date(
      new Date().getTime() - 86400000 * i // i days ago
    )

    const day = newDate.getDate();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();

    return new Date(year, month, day).toISOString().slice(0, 10);
  })

const candidates: DBCandidate[] = [
  {
    match: true,
    title: "Candidate 1",
    url: "https://www.candidate1.com",
    date_published: dates[0],
    dismissed: false,
    similarity: 0.99,
    matching_keywords: ["keyword1", "keyword2"],
    matching_harm_keywords: ["harmkeyword1"],
    matching_entities: ["entity1"]
  },
  {
    match: true,
    title: "Candidate 2",
    url: "https://www.candidate2.com",
    date_published: dates[1],
    dismissed: false,
    similarity: 0.85,
    matching_keywords: ["keyword3"],
    matching_harm_keywords: ["harmkeyword2"],
    matching_entities: ["entity2"]
  },
  {
    match: false,
    title: "Candidate 3",
    url: "https://www.candidate3.com",
    date_published: dates[2],
    dismissed: false,
    similarity: 0.99,
    matching_keywords: ["keyword4", "keyword5"],
    matching_harm_keywords: ["harmkeyword3"],
    matching_entities: []
  },
];

export default candidates;