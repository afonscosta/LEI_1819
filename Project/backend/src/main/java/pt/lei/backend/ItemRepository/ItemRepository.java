package pt.lei.backend.ItemRepository;


import pt.lei.backend.domain.Item;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends CrudRepository<Item, Long> {

    List<Item> findByName(@Param("name") String name);

    List<Item> findByQuantity(@Param("quantity") int quantity);

    List<Item> findByDone(@Param("done") boolean done);


}
