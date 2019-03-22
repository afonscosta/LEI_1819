package pt.lei.backend.controller;

import pt.lei.backend.ItemRepository.ItemRepository;
import pt.lei.backend.domain.Item;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController()
@RequestMapping("/api")
public class BackendController {

    private static final Logger LOG = LoggerFactory.getLogger(BackendController.class);

    public static final String HELLO_TEXT = "Hello from Spring Boot Backend!";

    @Autowired
    private ItemRepository itemRepository;

    @RequestMapping(path = "/hello")
    public @ResponseBody String sayHello() {
        LOG.info("GET called on /hello resource");
        return HELLO_TEXT;
    }

    @RequestMapping(path = "/item", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody long addNewItem (@RequestParam String name, @RequestParam int quantity, @RequestParam boolean done) {
        Item item = new Item(name, quantity, done);
        itemRepository.save(item);
        LOG.info(item.toString() + " successfully saved into DB");
        return item.getId();
    }

    @GetMapping(path="/item")
    public @ResponseBody Iterable<Item> getItems() {
        LOG.info("Reading all items from database.");
        return itemRepository.findAll();
    }

    @RequestMapping(path = "/item/delete/{id}", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody void removeItem (@PathVariable("id") long id) {
        itemRepository.deleteById(id);
        LOG.info("Deleted item with id " + id + " from database.");
    }

    @RequestMapping(path = "/item/done/{id}", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public @ResponseBody void doneItem (@PathVariable("id") long id) {
        Optional<Item> item = itemRepository.findById(id);
        item.ifPresent(i -> i.setDone(true));
        LOG.info("Done item with id " + id + " from database.");
    }
}
