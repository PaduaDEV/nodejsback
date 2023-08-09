create user C##NODE identified by node;

grant create session to C##NODE;

grant create table, create sequence, create user, create session to C##NODE with admin option;

grant dba to C##NODE with admin option;

conn C##NODE;