"use client";

import { Domain } from "@/lib/types/domain.type";
import { User } from "@/lib/types/user.type";
import { Vertical } from "@/lib/types/vertical.type";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface DomainContextType {
  users: User[];
  domains: Domain[];
  verticals: Vertical[];
  setDomains: Dispatch<SetStateAction<Domain[]>>;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

const mergeUniqueDomains = (domains: User[]) => {
  const domainMap = new Map<string, User>();
  domains.forEach((domain) => {
    if (!domainMap.has(domain.id)) {
      domainMap.set(domain.id, domain);
    }
  });
  return Array.from(domainMap.values());
};

const mergeUniqueVerticals = (domains: Vertical[]) => {
  const domainMap = new Map<string, Vertical>();
  domains.forEach((domain) => {
    if (!domainMap.has(domain.id)) {
      domainMap.set(domain.id, domain);
    }
  });
  return Array.from(domainMap.values());
};

export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const fetchUsers = async (domainIds: string[]) => {
    try {
      let newUsers: User[] = [];
      const promises = Promise.all(
        domainIds.map((domainId) => axios.get(`/api/domains/${domainId}/users`))
      );
      const responses = await promises;
      responses.forEach((response) => {
        newUsers = [...newUsers, ...response.data.response];
      });
      console.log("SET_DOMAIN_USERS: ", newUsers);
      setUsers(mergeUniqueDomains(newUsers));
    } catch (err) {
      console.error(err);
    }
  };
  const fetchVerticals = async (domainIds: string[]) => {
    try {
      let newDomains: Vertical[] = [];
      const promises = Promise.all(
        domainIds.map((domainId) =>
          axios.get(`/api/domains/${domainId}/verticals`)
        )
      );
      const responses = await promises;
      responses.forEach((response) => {
        newDomains = [...newDomains, ...response.data.response];
      });
      console.log("SET_VERTICALS: ", mergeUniqueVerticals(newDomains));
      setVerticals(mergeUniqueVerticals(newDomains));
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    console.log("SET_DOMAINS", domains);
    if (!domains) {
      console.error();
      return;
    }
    fetchUsers(domains.map((domain) => domain.id));
    fetchVerticals(domains.map((domain) => domain.id));
  }, [domains]);
  return (
    <DomainContext.Provider value={{ users, domains, verticals, setDomains }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => useContext(DomainContext);
