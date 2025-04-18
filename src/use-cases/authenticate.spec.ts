import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

// testes unitários não devem acessar banco de dados e nem nada externo

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    // sut = system under test
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John",
      email: "john@email.com",
      password_hash: await hash("12345", 6),
    });

    const { user } = await sut.execute({
      email: "john@email.com",
      password: "12345",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "john@email.com",
        password: "12345",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John",
      email: "john@email.com",
      password_hash: await hash("12345", 6),
    });

    await expect(() =>
      sut.execute({
        email: "john@email.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
