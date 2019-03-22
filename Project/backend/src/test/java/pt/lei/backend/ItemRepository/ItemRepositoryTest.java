package pt.lei.backend.ItemRepository;

import pt.lei.backend.domain.Item;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.Matchers.contains;
import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@DataJpaTest
public class ItemRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ItemRepository items;

    private Item item1 = new Item("bread", 1, true);
    private Item item2 = new Item("fish", 2, false);

    @Before
    public void fillSomeDataIntoOurDb() {
        // Add new Users to Database
        entityManager.persist(item1);
        entityManager.persist(item2);
    }

    @Test
    public void testFindByName() throws Exception {
        // Search for specific User in Database according to lastname
        List<Item> itemsWithNameBread = items.findByName("bread");

        assertThat(itemsWithNameBread, contains(item1));
    }

    @Test
    public void testFindByQuantity() throws Exception {
        // Search for specific User in Database according to firstname
        List<Item> itemsWithQuantity1 = items.findByQuantity(2);

        assertThat(itemsWithQuantity1, contains(item2));
    }

    @Test
    public void testFindByDone() throws Exception {
        // Search for specific User in Database according to lastname
        List<Item> itemsWithDoneTrue = items.findByDone(true);

        assertThat(itemsWithDoneTrue, contains(item1));
    }

}