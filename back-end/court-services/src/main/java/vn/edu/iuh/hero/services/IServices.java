package vn.edu.iuh.hero.services;

import java.util.Optional;

public interface IServices<T, P> {
    Iterable<T> findAll();
    Optional<T> findById(P p);
    T save(T t);
    T delete(P p);
    T update(T t);

}
